#
# Copyright 2024 Scott J. Johnson (https://scottjjohnson.com)
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
# ATRWithGapUpIndicator
#
# Calculates the ATR and shows an indicator if there was a significant gap up
# at the open.  A gap up may be buyable if the opening gap up is > 75% of 40
# period ATR and the volume >= 150% of the average volume over the last 40 
# sessions.
#
declare lower;

input ATRLength = 40;
input MinimumPercentGap = 75;  # percent of average true range required to be a gap

def ATR = Average(TrueRange(high, close, low), ATRLength);
def GapUp = (open - high[1]);
def GapUpEvent = GapUp >= ATR[1] * MinimumPercentGap / 100;

plot Display = Round(ATR, 2);
Display.AssignValueColor(if GapUpEvent >= 1 then Color.GREEN else Color.LIGHT_GRAY);
Display.SetLineWeight(3);
