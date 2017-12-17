#
# Copyright 2017 Scott J. Johnson (http://scottjjohnson.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# 
# VolumePercentChangeFromAverage
#
# Shows the current bar volume as a percentage change of the average volume
# over the last X bars. Volume equal to or higher than the threshold is shown
# in yellow. 
#

declare lower;
declare zerobase;

input period = 50;  # interval over which the average volume is calculated
input highVolumeThresholdPercent = 40;  # 40% above average

plot VolumePercent = (volume / Average(volume, period) - 1 ) * 100;
VolumePercent.AssignValueColor(if VolumePercent >= highVolumeThresholdPercent then GetColor(4) else GetColor(1));
VolumePercent.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
VolumePercent.SetLineWeight(2);
VolumePercent.HideBubble();

plot zero = 0.0;
zero.SetDefaultColor(Color.WHITE);
zero.SetLineWeight(1);
zero.HideBubble();
zero.HideTitle();
