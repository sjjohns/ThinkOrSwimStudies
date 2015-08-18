#
# Copyright 2014 Scott J. Johnson (http://scottjjohnson.com)
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
# ATRPercent
#
# Calculates the ATR as a percentage of the last closing price.
#
declare lower;

input ATRLength = 40;

plot ATR = Round(Average(TrueRange(high, close, low), ATRLength) / close * 100,2);
ATR.SetDefaultColor(GetColor(8));  # yellow
